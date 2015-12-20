# cantaloupe-cli

TODO: Write a project description

## Installation

`npm install -g cantaloupe-cli`
Make sure to have NodeJS installed. Version 4.2 or great is required.


## Usage

Make sure to be in the root of your project folder.

1. `cantaloupe login`
  *. Enter credentials
  *. They will be saved in the file `.cantaloupe`
2. `cantaloupe deploy --site site-name`
  *. site-name is the site name that was created when you made your cantaloupe site.

Currently, it will only deploy files from the `build` folder. This is built for [Middleman](https://middlemanapp.com/) at the current moment. Future versions will allow you to specify the files to deploy.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

Version 1.0: Adding basic login and deploy functionality. Will only deploy items in the relative "build" folder.

## License

TODO: Write license