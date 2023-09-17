import _jade from "jade";
import fs from "fs";

// @relativeTemplatePath is the path relative to the views directory, so include subDirectories if necessary
// @data is the data that will be injected into the template
export function jadeCompiler(relativeTemplatePath: string, data: any) {
    // actual path where the template lives on the file system, assumes the standard /views directory
    // output would be something like /var/www/my-website/views/email-template.jade
    const absoluteTemplatePath =
        process.cwd() + "/views/" + relativeTemplatePath + ".jade";

    // get our compiled template by passing path and data to jade
    _jade.renderFile(absoluteTemplatePath, data);
}
