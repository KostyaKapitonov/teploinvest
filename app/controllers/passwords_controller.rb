class PasswordsController < Devise::PasswordsController
  def new
    super
  end

  def create
    if check_captcha(params[:captcha_id],params[:captcha])
      super
    else
      render json: {success: false, new_captcha: get_captcha}
    end
  end

  def edit
    super
  end

  def update
    super
  end
end