const route = {
    description: "💿 remix route",
    prompts: [
        {
            type: "input",
            name: "name",
            message: "route name",
        },
        {
            type: "checkbox",
            name: "features",
            loop: true,
            choices: [
                {
                    name: "Meta Function",
                    value: "meta",
                    checked: true,
                },
                {
                    name: "Loader Function",
                    value: "loader",
                    checked: true,
                },
                {
                    name: "Action Function",
                    value: "action",
                    checked: true,
                },                
                {
                    name: "Error Boundary",
                    value: "error",
                    checked: true,
                },
                {
                    name: "Links Function",
                    value: "links",
                    checked: false,
                },
            ],
        },
    ],
    actions: [
        {
            type: "add",
            path: "app/routes/{{name}}.tsx",
            templateFile: "./plop-templates/templates/route.hbs",
        },
    ],
}

export default route
