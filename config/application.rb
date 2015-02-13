require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Antalex
  class Application < Rails::Application

    config.autoload_paths += %W(#{config.root}/lib/assets/)
    config.time_zone = 'Moscow'

    config.action_mailer.delivery_method = :smtp
    config.action_mailer.default_url_options = {:from => ENV['TEPLOINVEST_EMAIL_ADDRESS']}
    config.action_mailer.smtp_settings = {
        from: ENV['TEPLOINVEST_EMAIL_ADDRESS'],
        address: 'smtp.yandex.ru',
        port: 587,
        user_name: 'Kapitonov-kg',
        password: ENV['TEPLOINVEST_EMAIL_PASSWORD'],
        authentication: :plain,
        enable_starttls_auto: true
    }
    config.action_mailer.perform_deliveries = true
    config.action_mailer.raise_delivery_errors = true
    # todo: USE like this:
    # ActionMailer::Base.mail(from: ENV['TEPLOINVEST_EMAIL_ADDRESS'], :to => "kapitonovkg@sfdev.com", :subject => "как бы тест", :body => "Просто <b>тест</b> 3",  charset: 'UTF-8', content_type: "text/html").deliver_now

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
  end
end
