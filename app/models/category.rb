class Category < ActiveRecord::Base
  has_many :products
  before_destroy :any_products?

  private

  def any_products?
    self.products.size == 0
  end
end
