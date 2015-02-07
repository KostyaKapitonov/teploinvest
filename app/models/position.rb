class Position < ActiveRecord::Base
  belongs_to :cart
  belongs_to :product
  before_create :is_product_actual?
  before_update :is_product_actual?

  private

  def is_product_actual?
    return false if self.cart.blank?
    pids = []
    self.cart.positions.each { |p| pids << p.product_id }
    self.name = self.product.name
    self.price = self.product.price
    self.sum = self.price*self.count
    !self.product.blank? && self.product.exist && !self.product.hidden && self.count > 0
  end
end
