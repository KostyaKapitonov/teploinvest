class SettingsController < ApplicationController
  before_filter :only_admin, except: [:get_new_captcha]
  layout 'angular'

  def update
    success = Setting.first.update(params.require(:setting).permit(:main_page_text, :contacts_text,
      :recalculatable, :default_sort_type, :map_code, :self_delivery_address, :about_text,
      :price_list_text, :payment_and_delivery_text, :installation_text))
    render json: {success: success}
  end

  def global
    if params[:code] && current_user && current_user.is_admin
      current_user.refresh_yandex_token(params[:code])
    end
  end
  def page_editor
  end

  def get_new_captcha
    render json: get_captcha
  end

end
