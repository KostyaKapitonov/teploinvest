class RegistrationsController < Devise::RegistrationsController
  def new
    super
  end

  def create
    if check_captcha(params[:user][:captcha_id],params[:user][:captcha])
      super
    else
      render json: {success: false, new_captcha: get_captcha}
    end
  end

  def update
    super
  end
end