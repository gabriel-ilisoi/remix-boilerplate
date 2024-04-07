import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { redirect, type ActionFunctionArgs } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

import { getUserId } from '~/services/auth.server'
import { createPost } from '~/services/post/post.server'

import { postCreateSchema as schema } from '~/services/post/post'

export async function action(args: ActionFunctionArgs) {
  const { request } = args
  const userId = await getUserId(args)
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    await createPost({ ...submission.value, userId })
    return redirect('/zz')
  } catch (error) {
    return submission.reply({
      formErrors: ['Failed to send the body. Please try again later.'],
    })
  }
}

export default function CreatePost() {
  const lastResult = useActionData<typeof action>()
  const [form, fields] = useForm({
    defaultValue: {
      title: 'Foo',
      body: 'Bar',
    },
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
