class ProductsController < ApplicationController
  before_filter :only_admin, except: [:main, :main_content, :index, :show, :contacts]
  # layout 'angular'

  def main
    render 'main', layout: 'application'
  end

  def main_content
    respond_to do |format|
      format.html
      format.json {
        @setting = Setting.first
        render json: @setting
      }
    end
  end

  def loading
  end

  def index
    respond_to do |format|
      format.html
      format.json {
        return render json: {products: Product.all, categories: Category.all, firms: Firm.all, sub_cats: SubCat.all} if current_user && current_user.is_admin
        render json: {products: Product.where(hidden: false).all, categories: Category.all, firms: Firm.all, sub_cats: SubCat.all}
      }
    end
  end

  def get_category_and_firm_options
    render json: {categories: Category.all, firms: Firm.all, sub_cats: SubCat.all}
  end

  def create_category_or_firm_option
    success = false
    category = nil
    firm = nil
    sub_cat = nil
    if params[:category]
      category = Category.new(params.require(:category).permit(:name))
      success = category.save
    elsif params[:firm]
      firm = Firm.new(params.require(:firm).permit(:name))
      success = firm.save
    elsif params[:sub_cat]
      sub_cat = SubCat.new(params.require(:sub_cat).permit(:name))
      success = sub_cat.save
    end
    render json: {success: success, firm: firm, category: category, sub_cat: sub_cat,
                  categories: Category.all, firms: Firm.all, sub_cats: SubCat.all}
  end

  def delete_category_or_firm_option
    success = false
    if params[:category]
      success = Category.where(id: params[:category]).first.destroy;
    elsif params[:firm]
      success = Firm.where(id: params[:firm]).first.destroy;
    elsif params[:sub_cat]
      success = SubCat.where(id: params[:sub_cat]).first.destroy;
    end
    render json: {success: success, categories: Category.all, firms: Firm.all, sub_cats: SubCat.all}
  end

  def new
  end

  def show
    respond_to do |format|
      format.html
      format.json {
        render json: Product.where(id: params[:id]).first
      }
    end
  end

  def create
    params.require(:product).require(:name)
    product = Product.new(params.require(:product).permit(:name, :category_id, :firm_id, :valute, :sub_cat_id,
      :price, :description, :image, :exist, :hidden))
    render json: {success: product.valid? && product.save, product: product}
  end

  def edit
    respond_to do |format|
      format.html
      format.json {
        render json: Product.where(id: params[:id]).first
      }
    end
  end

  def update
    params.require(:product).require(:name)
    render json: {success: Product.update_if_exist(params[:id],
      params.require(:product).permit(:name, :category_id, :firm_id, :valute, :sub_cat_id, :price, :description,
                                      :image, :exist, :hidden))}
  end

  def destroy
    render json: {success: Product.where(id: params[:id]).first.try(:destroy)}
  end
end
