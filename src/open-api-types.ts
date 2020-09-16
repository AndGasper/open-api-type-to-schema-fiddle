/* tYpEs aRe nOt ClAsSeS */

import "reflect-metadata"

enum OpenApi {
    V2_0 = "2.0",
    V3_0 = "3.0",
    V3_1 = "3.1"
}


type Result<T> =
    | {ok: true, value: T }
    | {ok: false, message: string } 

// mailbox name = abc
// domain name = mail 
// abc@mail.com
type EmailAddress = {
    domainName: string
    mailboxName: string 
}
type Contact = {
    name: string,
    url: URL,
    email: EmailAddress
}
type License = {
    name: string,
    url?: URL,
}

type Operation = {

}

// should probably be fancier
type DeepObject = Object;


type Matrix = {}
type Label = {}
type Form = {}
type PipeDelimited = {}

type SpaceDelimited = {}
/* not really */
type StyleValue = {
    MATRIX: Matrix,
    LABEL: Label,
    FORM:  Form,
    SIMPLE: Array<any>, /* but not really any */
    SPACE_DELIMITED: SpaceDelimited,
    PIPE_DELIMITED: PipeDelimited,
    DEEP_OBJECT: DeepObject

}

enum ParameterObjectName {
    ACCEPT = "Accept",
    CONTENT_TYPE = "Content-Type",
    AUTHORIZATION = "Authorization"
}
enum ParameterLocationIn {
    QUERY = "query",
    HEADER = "header",
    PATH  = "path",
    COOKIE = "cookie"

}

type TemplateExpression = {}

// ParameterObject
// REQUIRED. The name of the parameter. Parameter names are case sensitive.
// If in is "path", the name field MUST correspond to a template expression 
// occurring within the path field in the Paths Object. 
// See Path Templating for further information.
// If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.
// For all other cases, the name corresponds to the parameter name used by the in property.

type PropertyValidtor<T> =
    | IValidator<T>
    | (value: unknown) => Result<T>; 

// Sets the ability to pass empty-valued parameters. 
// This is valid only for query parameters and allows sending a parameter with an empty value. 
// Default value is false. If style is used, and if behavior is n/a (cannot be serialized), 
// the value of allowEmptyValue SHALL be ignored. Use of this property is NOT RECOMMENDED, 
// as it is likely to be removed in a later revision.

type ParameterLocation = {
    path: PathObject,
    query: QueryObject,
    header: HeaderObject
}

type PathObject = {}
type QueryObject = {}
type HeaderObject = {}




// path: /items/{itemId} -> id
// query: /items?id=### -> id 
// header: ? RFC7230
// cookie: cookie specific
type ParameterObject = {
    name: string, // circle back
    in: ParameterLocationIn,
    description?: string,
    required: boolean,
    deprecated?: boolean, /* default false? */
    allowEmptyValue?: boolean /* circle back to handle */
}

class ParameterObject {
    private _name: ParameterObjectName;
    private _in: ParameterLocationIn
    
    
    // define experimental decorator function for validation
    @validateParameterObjectName
    // define metadata to blend the logic (based on a small example I saw)
    @Reflect.metadata("dependsOn:in", "in")
    set name(value: ParameterObjectName) {
        this._name = value;
    }
    get name(): ParameterObjectName {
        return this._name;
    }
    get in(): ParameterLocationIn {
        return this._in;
    }
    set in(value: ParameterLocationIn) {
        this._in = value;
    }
        
}

function validateParameterObjectName<T>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
) {
    const debugging = {
        target,
        propertyKey,
        descriptor
    };
    console.log('debugging', debugging);
    let set = descriptor.set;
    // descriptor.set = function(value: T) {
    //     // query, header, path, cookie
    //     // let in = Reflect.getMetadata(
    //     //     "dependsOn:in",
    //     //     target, // maybe not quite
    //     //     propertyKey 
    //     // );
    //     let in = Reflect.getMetadata()
    //     /* tslint ignore */
    //     set.call(target, value);

    // }
    // I can't see the error right now, and it's kind of irrelevant at the moment
    descriptor.set = function(value: T) {
        let in = Reflect.getMetadata(
            "dependsOn:in",
            target, // kind of circular logic which bugs me
            propertyKey
        );
        // something, something refactor complex conditional to polymorphism
        if (in === "path" && (value instanceof TemplateExpression)) {
            set.call(target, value); 
        } else {
            throw new TypeError("When `in` is 'path', the `name` must be an instance of TemplateExpression");
        }

        if (in === "header" && (value instanceof ParameterObjectName)) {
            // SHALL be ignored
            set.call(target, undefined)
        } // maybe raise a new warning
        // For all other cases, the name corresponds to the parameter name used by the in property.
        if (in !== "path" && in !== "header") {
            set.call(target, in)
        }

    }
}
type ExternalDocumentation = {
    description?: string,
    url: URL
}
enum PathName {

}
type ReferenceObject = {
    
}
type PathItem = {
    $ref: string,
    summary?: string,
    description?: string,
    get?: Operation,
    put?: Operation,
    post?: Operation,
    delete?: Operation,
    options?: Operation,
    head?: Operation,
    patch?: Operation,
    trace?: Operation,
    servers?: ServerObject,
    parameters?: ParameterObject | ReferenceObject

}
type Info = {
    title: string,
    description?: string,
    termsOfService?: URL,
    contact?: Contact,
    license?: License,
    version: string

}
type ServerVariable = {
    "enum"?: string[], /* SHOULD NOT be empty -> sHoUlD nOt bE EmPtY */
    default: string, 
    description?: string
}

type ServerObject = {
    url: string,
    description?: string,
    variables: ServerVariable[]
}