class User < ActiveRecord::Base
  has_many :user_providers, dependent: :destroy
  has_many :carts, dependent: :destroy
  # validates_uniqueness_of :email

  before_save do
    self.email.downcase! if self.email
  end

  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable
  attr_accessor :captcha_id, :captcha


  def self.find_or_create auth_params
    user = User.where(provider: auth_params[:provider], vk_id: auth_params[:vk_id]).first || User.create!(auth_params)
    user
  end

  def self.find_or_create_by_ulogin auth_params
    user = User.where(url: auth_params[:url]).first || User.create!(auth_params)
    user
  end

  def self.find_and_confirm_email(token)
    return nil if token.blank?
    user = User.where(confirmation_token: token, confirmed_at: nil).first
    unless user.blank?
      user.confirmed_at = Date.today
      user.save
    end
    user
  end

  def self.find_to_reset_email(token)
    return nil if token.blank?
    user = User.where(reset_password_token: token).first
    unless user.blank?
      user.confirmed_at = Date.today
      user.save
    end
    user
  end

  def update_password(user, user_params)
    success = user.update(user_params)
    result = {success: success}
    result[:error] = user.errors unless success
    result[:user] = user if success
    result
  end
end
