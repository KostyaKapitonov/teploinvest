class CustomPagesController < ApplicationController
  before_filter :only_admin, except: [:index]

  def new #only html
  end

  def create
  end

  def index
    render json: CustomPage.all
  end

  def update
  end

  def destroy
  end

  def set_order
    render json: {success: CustomPage.set_order(params)}
  end

end
