def base_path
  base_path_str = ENV["BASE_PATH"].to_s

  return "/" if base_path_str.empty?
  return base_path_str + "/" unless base_path_str.ends_with?("/")

  base_path_str
end

def url
  url_str = ENV["URL"].to_s

  return "/" if url_str.empty?
  return url_str + "/" unless url_str.ends_with?("/")

  url_str
end

Bridgetown.configure do |config|
  config.url = url
  config.base_path = base_path
  config.base_path_no_trailing_slash = config.base_path.delete_suffix("/")

  config.base_url = config.url.delete_suffix("/") + config.base_path
  config.base_url_no_trailing_slash = config.url.delete_suffix("/") + config.base_path_no_trailing_slash
  init :"bridgetown-quick-search"

  # init :ssr
  # init :"bridgetown-routes"
  # only :server do
  #   roda do |app|
  #     app.plugin :default_headers,
  #       'Content-Type'=>'text/html',
  #       'Strict-Transport-Security'=>'max-age=16070400;',
  #       'X-Content-Type-Options'=>'nosniff',
  #       'X-Frame-Options'=>'deny',
  #       'X-XSS-Protection'=>'1; mode=block',
  #       'Access-Control-Allow-Origin'=>'*'
  #   end
  # end
end

require "rouge"

module Rouge
  module Lexers
    # These lexers don't implement the `prepend` class method so they'll raise an error if we don't skip them.
    problem_lexers = [
      ::Rouge::Lexers::ConsoleLexer,
      ::Rouge::Lexers::Escape,
      ::Rouge::Lexers::IRBLexer,
      ::Rouge::Lexers::PlainText
    ]

    ::Rouge::Lexer.all.each do |lexer|
      next if problem_lexers.include?(lexer)

      # Ruleset courtesy of this issue:
      # https://github.com/rouge-ruby/rouge/issues/642
      lexer.prepend :root do
        rule(/^\+.*$\n?/, lexer::Generic::Inserted)
        rule(/^-+.*$\n?/, lexer::Generic::Deleted)
        rule(/^!.*$\n?/, lexer::Generic::Strong)
        rule(/^@.*$\n?/, lexer::Generic::Subheading)
        rule(/^([Ii]ndex|diff).*$\n?/, lexer::Generic::Heading)
        rule(/^=.*$\n?/, lexer::Generic::Heading)
      end
    end
  end
end
