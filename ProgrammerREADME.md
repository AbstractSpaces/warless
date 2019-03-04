# Modules

With the current setup, modules can be specified relative to the src folder, e.g. "server/routes/router".
Modules installed via npm can apparently be referenced by name, e.g. "path".
Importing a folder as a module works if there is an index.ts in the folder.

# _dirname

After bundling code is executed with dist as the working directory, so any paths to be joined/resolve at runtime need to be specified relative to dist.