class UsersController < ApplicationController
  before_filter :only_logged_in, except: [:u_login, :login, :is_email_free, :create, :confirm_email,
    :password_reset, :email_to_reset_pass]
  before_filter :only_admin, only: [:show]

  def login # only for template render
  end

  def email_to_reset_pass # only for template render
  end

  def create # only for template render
  end

  def show
    render json: User.where(id: params[:id]).first
  end

  def u_login
    p 'here!'
    params.require(:u_token)
    authorized = false
    user_login_info = get_ulogin_data(params[:u_token])
    unless user_login_info['identity'].blank?
      provider = UserProvider.where(url: user_login_info['identity']).first
      if provider.blank?
        unless current_user.blank?
          UserProvider.create(url: user_login_info['identity'], user_id: current_user.id)
          return render json: {authorized: true, provider: 'added'}
        end
      else
        if !current_user.blank?
          return render json: {authorized: true, provider: 'already'}
        else
          user = provider.user
          unless user.blank?
            sign_in(:user, user)
            return render json: {authorized: true, provider: 'welcome'}
          end
        end
      end
    end
    render json: {authorized: authorized, data: user_login_info}
  end

  def is_email_free
    render json: {free: User.where(email: params[:email].to_s.downcase).first.blank?}
  end

  def confirm_email
    user = User.find_and_confirm_email(params[:token])
    return redirect_to root_path(confirm_msg: 'invalid_token') if user.blank?
    sign_in(:user, user)
    redirect_to root_path(confirm_msg: 'thx')
  end

  def password_reset
    if request.get?
      respond_to do |f|
        f.html
        f.json {
          user = User.find_to_reset_email(params[:token])
          render json: user.blank? ? {success: false} : {email: user.email}
        }
      end
    elsif request.post?
      if check_captcha(params[:captcha_id],params[:captcha])
        user = User.find_to_reset_email(params[:token])
        not_found if user.blank?
        result = user.update_password(user, params.permit(:password, :password_confirmation))
        render json: result
      else
        render json: {success: false, new_captcha: get_captcha}
      end
    end
  end

  def account
    if request.post?
      params.require(:user).require(:id)
      user = User.where(id: params[:user][:id]).first
      not_found if user.blank? || user.id != current_user.id
      render json: {success: user.update(params.require(:user).permit(:first_name, :last_name, :father_name, :address, :mobile))}
    end
  end

  def add_provider
    params.require(:u_token)
    UserProvider.create(get_ulogin_data(params[:u_token]))
  end

  private # --- private  --- private  --- private  --- private  --- private  --- private  ---

  def get_ulogin_data(token)
    url = URI.parse("http://ulogin.ru/token.php?token=#{params[:u_token]}")
    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url.port) {|http| http.request(req)}
    JSON.parse res.body
  end

  # def get_request(url)
  #   # encoding: UTF-8
  #   url = URI.parse(url)
  #   req = Net::HTTP::Get.new(url.to_s)
  #   res = Net::HTTP.start(url.host, url.port) {|http|
  #     http.request(req)
  #   }
  #   # Hash.from_xml(get_request('http://www.cbr.ru/scripts/XML_daily.asp'))
  #   # res.body
  #   xml = Hash.from_xml(res.body)
  #   valutes = xml['ValCurs']['Valute']
  #   usd = nil
  #   valutes.each do |v|
  #     if v['CharCode'] == 'USD'
  #       usd = v['Value']
  #     end
  #   end
  #   usd
  # end

end
