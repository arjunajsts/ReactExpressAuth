// .babelrc or babel.config.js
{
    "plugins": [
      [
        "module-resolver",
        {
          "root": ["./src"], // Adjust as necessary
          "alias": {
            "@": "./src"
          }
        }
      ]
    ]
  }
  