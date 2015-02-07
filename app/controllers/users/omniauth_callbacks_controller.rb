# class Users::OmniauthCallbacksController < ApplicationController
#   skip_before_filter :verify_authenticity_token
#
#   def vkontakte
#     auth_params = parse_oauth_params(request.env["omniauth.auth"])
#     @user = User.find_or_create(auth_params)
#     if @user.persisted?
#       sign_in_and_redirect @user, :event => :authentication
#     else
#       redirect_to root_path
#     end
#   end
#
#   def facebook
#     auth_params = parse_oauth_params(request.env["omniauth.auth"])
#     @user = User.find_or_create(auth_params)
#     if @user.persisted?
#       sign_in_and_redirect @user, :event => :authentication
#     else
#       redirect_to root_path
#     end
#   end
#
#   def failure
#     if params[:error] == 'access_denied' && params[:error_reason] == 'user_denied'
#       flash[:error] = 'Вы отказались предоставить доступ к общей информации о вашей странице Вконтакте.'
#     else
#       flash[:error] = 'Неизвестная ошибка'
#     end
#     redirect_to root_path
#   end
#
#   private
#
#   def parse_oauth_params(auth_params)
#     {
#         :provider => auth_params.provider,
#         :url => auth_params.info.urls.Vkontakte.to_s,
#         :username => auth_params.info.name,
#         :vk_id => auth_params.uid,
#         :nickname => auth_params.extra.raw_info.nickname.blank? ?
#             auth_params.extra.raw_info.screen_name :
#             auth_params.extra.raw_info.nickname,
#         :email => "#{auth_params.provider}_#{auth_params.uid}@gmail.com",
#         :photo => auth_params.extra.raw_info.photo_50,
#         :password => Devise.friendly_token[0,20]
#     }
#   end
#
#   def parse_ulogin_params(auth_params)
#     {
#         :provider => auth_params['network'],
#         :url => auth_params['identity'],
#         :username => auth_params['first_name']+' '+auth_params['last_name'],
#         :vk_id => auth_params['uid'],
#         :email => "#{auth_params['identity']}@gmail.com",
#         :password => Devise.friendly_token[0,20]
#     }
#   end
# end
