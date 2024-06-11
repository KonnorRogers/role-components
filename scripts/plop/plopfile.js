export default function (plop) {
  const componentPrefix = "role-"
  plop.setHelper('tagWithoutPrefix', tag => tag.replace(new RegExp(`^${componentPrefix}`), ''));

  plop.setHelper('tagToTitle', tag => {
    const withoutPrefix = plop.getHelper('tagWithoutPrefix');
    const titleCase = plop.getHelper('titleCase');
    return titleCase(withoutPrefix(tag).replace(/-/g, ' '));
  });

  plop.setGenerator('component', {
    description: 'Generate a new component',
    prompts: [
      {
        type: 'input',
        name: 'tag',
        message: 'Tag name? (e.g. role-button)',
        validate: value => {
          // Start with role- and include only a-z + dashes
          if (!/^role-[a-z-+]+/.test(value)) {
            return false;
          }

          // No double dashes or ending dash
          if (value.includes('--') || value.endsWith('-')) {
            return false;
          }

          return true;
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../../exports/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}-register.js',
        templateFile: 'templates/component-register.hbs'
      },
      {
        type: 'add',
        path: '../../exports/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.js',
        templateFile: 'templates/component.hbs'
      },
      {
        type: 'add',
        path: '../../exports/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.styles.js',
        templateFile: 'templates/component-styles.hbs'
      },
      {
        type: 'add',
        path: '../../tests/{{ tagWithoutPrefix tag }}/{{ tagWithoutPrefix tag }}.test.js',
        templateFile: 'templates/component/component-tests.hbs'
      },
      {
        type: 'add',
        path: '../../docs/src/_documentation/components/{{ tagWithoutPrefix tag }}.md',
        templateFile: 'templates/component/component-docs.hbs'
      },
    ]
  });
}
