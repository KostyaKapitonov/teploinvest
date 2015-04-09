class CustomPagesController < ApplicationController
  before_filter :only_admin, except: [:index]

  def new #only html
  end

  def create
    render json: {obj: CustomPage.create(params.require(:page).permit(:label, :title, :keywords,
      :description, :color, :body , :seq))}
  end

  def index
    render json: CustomPage.all
  end

  def update
    render json: {obj: CustomPage.create(params.require(:page).permit(:label, :title, :keywords,
      :description, :color, :body , :seq))}
  end

  def destroy
    render json: {success: CustomPage.where(id: params[:id]).first.destroy}
  end

  def set_order
    render json: {success: CustomPage.set_order(params)}
  end

end
