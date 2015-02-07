class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  helper_method :admin?
  protect_from_forgery with: :exception
  respond_to :json, :html
  layout 'angular'

  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  def only_logged_in
    raise ActionController::RoutingError.new('Not Found') if current_user.blank?
  end

  def admin?
    !current_user.blank? && current_user.is_admin
  end

  def only_admin
    raise ActionController::RoutingError.new('Not Found') if current_user.blank? || !current_user.is_admin
  end

  def get_captcha
    res = get_xml_resp_as_hash('http://cleanweb-api.yandex.ru/1.0/get-captcha?key='+
                                   ENV['CAPTCHA_APP_KEY']+'&type=lite')
    res['get_captcha_result']
  end

  def check_captcha(captcha_id, val)
    res = get_xml_resp_as_hash('http://cleanweb-api.yandex.ru/1.0/check-captcha?key='+
                                   ENV['CAPTCHA_APP_KEY']+'&captcha='+captcha_id.to_s+'&value='+val.to_s)
    res && res['check_captcha_result'] && res['check_captcha_result'].has_key?('ok')
  end

  private

  def get_xml_resp_as_hash(url)
    url = URI.parse(url)
    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    Hash.from_xml(res.body)
  end

end
