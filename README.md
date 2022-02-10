# TailwindUI to BEM and React

A small script that can convert a template from TailwindUI in a BEM scss file and React starter template

```git clone ...```

```cd tailwindui-to-bem-and-react```

```yarn```

Define an App prefix in the `config.js` file

Copy a template from TailwindUi and paste it in the `template.js` file

Add the attribute `templateId` to the tag where there is class (it is use for generating the BEM classes)
The attribute `templateId` of the first tag of the template should be named as the component name

Run `yarn convert`

Go to the output folder and discover the files generated ;-)
