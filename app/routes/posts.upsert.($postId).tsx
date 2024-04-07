import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import {
  LoaderFunctionArgs,
  json,
  redirect,
  type ActionFunctionArgs,
} from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'

import { getUserId } from '~/services/auth.server'
import { createPost, getPost, updatePost } from '~/services/post/post.server'

import { postCreateSchema, postUpdateSchema } from '~/services/post/post'

export async function action(args: ActionFunctionArgs) {
  const { request } = args
  const { postId } = args.params
  const schema = postId ? postUpdateSchema : postCreateSchema
  const userId = await getUserId(args)
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return json(submission.reply())
  }

  try {
    if (postId) {
      await updatePost({ ...submission.value, userId, id: postId })
    } else {
      await createPost({ ...submission.value, userId })
    }
    return redirect('/zz')
  } catch (error) {
    console.log(`🚀 ~ action ~ error:`, error)
    return json(
      submission.reply({
        formErrors: ['Failed to send the body. Please try again later.'],
      }),
    )
  }
}

export async function loader(args: LoaderFunctionArgs) {
  const userId = await getUserId(args)

  if (userId === 'GUEST') {
    return redirect('/sign-in')
  }
  const { postId } = args.params
  if (!postId) {
    return {
      userId,
      post: null,
      postId,
    }
  }
  const post = await getPost({ userId, id: postId })
  const data = { userId, post, postId }
  return json(data)
}

export default function UpsertPost() {
  const data = useLoaderData<typeof loader>()
  console.log(`🚀 ~ UpsertPost ~ data:`, data)
  const lastResult = useActionData<typeof action>()
  // const schema:typeof postCreateSchema|typeof postUpdateSchema = data.postId ? postUpdateSchema : postCreateSchema

  let schema: typeof postCreateSchema | typeof postUpdateSchema =
    postUpdateSchema
  if (!data.postId) {
    schema = postCreateSchema
  }
  const [form, fields] = useForm({
    defaultValue: data.post || {},
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })

  const labelProps = {
    className:
      'block label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2',
  }
  const errorProps = {
    className: 'bg-error text-error-content mt-2 p-2 rounded-md block w-fit',
  }
  type fieldKeys = keyof typeof fields
  const getErrorProps = (fieldName: fieldKeys) => {
    return fields[fieldName].errors ? errorProps : {}
  }

  return (
    <Form method="post" {...getFormProps(form)}>
      <div>
        {!data.postId ? null : (
          <input {...getInputProps(fields?.id, { type: 'hidden' })} />
        )}
        <label {...labelProps} htmlFor={fields.title.id}>
          Title
        </label>
        <input {...getInputProps(fields.title, { type: 'text' })} />
        <div {...getErrorProps('title')} id={fields.title.errorId}>
          {fields.title.errors}
        </div>
      </div>
      <div>
        <label {...labelProps} htmlFor={fields.body.id}>
          Message
        </label>
        <textarea
          className="textarea textarea-bordered bg-base-200 focus:outline-secondary-focus"
          {...getTextareaProps(fields.body)}
        />
        <div {...getErrorProps('body')} id={fields.body.errorId}>
          {fields.body.errors}
        </div>
      </div>
      <button className="btn btn-lg btn-secondary btn-block mt-4">Send</button>
    </Form>
  )
}
