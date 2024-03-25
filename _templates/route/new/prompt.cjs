// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: 'input',
    name: 'name',
    message: "What's your route name?"
  },
  {
    type: "multiselect",
    name: "features",
    message: "Pick features",
    loop: true,

   
    choices: [
      {
        message: "Meta Function",
        name: "meta",
        checked: true,
      },
      {
        message: "Loader Function",
        name: "loader",
        checked: true,
      },
      {
        message: "Action Function",
        name: "action",
        checked: true,
      },
      {
        message: "Error Boundary",
        name: "error",
        checked: true,
      },
      {
        message: "Links Function",
        name: "links",
        checked: false,
      },
    ]
  },
]
