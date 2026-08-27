import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: [
            "**/dist",
            "**/out-tsc"
        ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    depConstraints: [
                        {
                            sourceTag: "type:app",
                            onlyDependOnLibsWithTags: [
                                "type:feature",
                                "type:ui",
                                "type:data-access",
                                "type:util",
                                "type:contract"
                            ]
                        },
                        {
                            sourceTag: "type:domain",
                            onlyDependOnLibsWithTags: [
                                "type:domain",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:feature",
                            onlyDependOnLibsWithTags: [
                                "type:feature",
                                "type:data-access",
                                "type:domain",
                                "type:util",
                                "type:contract"
                            ]
                        },
                        {
                            sourceTag: "type:data-access",
                            onlyDependOnLibsWithTags: [
                                "type:data-access",
                                "type:domain",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:util",
                            onlyDependOnLibsWithTags: [
                                "type:util"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    }
];
