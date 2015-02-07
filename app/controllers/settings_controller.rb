class SettingsController < ApplicationController
  before_filter :only_admin, except: [:get_new_captcha]
  layout 'angular'

  def update
    success = Setting.first.update(params.require(:setting).permit(:main_page_text, :contacts_text, :recalculatable, :default_sort_type, :map_code, :self_delivery_address))
    render json: {success: success}
  end

  def global
  end
  def page_editor
  end

  def get_new_captcha
    render json: get_captcha
  end

end
