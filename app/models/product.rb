class Product < ActiveRecord::Base
  belongs_to :category
  belongs_to :firm
  belongs_to :sub_cat
  has_many :positions
  has_many :images
  accepts_nested_attributes_for :images, :allow_destroy => true
  cattr_accessor :skip_filter

  # before_save :calculate_rub_price, unless: :skip_filter
  after_update :remove_unconfirmed_positions
  before_destroy :remove_positions_on_destroy

  def self.update_if_exist(id, params)
    product = Product.where(id: id).first
    return false if product.blank?
    product.update(params)
  end

  def self.recalculate_by_usd_eur_rate(usd, eur, carts)
    # products = Product.all
    # Product.skip_filter = true
    # products.each do |p|
    #   p.update(price: ('%.2f' % (p.usd_price*usd)).to_f) if p.valute == 'USD'
    #   p.update(price: ('%.2f' % (p.usd_price*usd)).to_f) if p.valute == 'EUR'
    #   carts.each do |cart|
    #     cart.positions.each do |pos|
    #       if p.id == pos.id
    #         pos.price = p.price
    #         pos.save
    #       end
    #     end
    #   end
    # end
    # Product.skip_filter = false
  end

  private

  def calculate_rub_price
    setting = Setting.first
    if setting.recalculatable && self.valute != 'RUB'
      self.price = ('%.2f' % (self.usd_price.to_f*setting.usd_rate.to_f)).to_f
    end
  end

  def remove_unconfirmed_positions
    pos = []
    Cart.where(confirmed: false).all.each do |cart|
      cart.positions.each do |p|
        pos << p
      end
    end
    pos_to_del = []
    pos.each do |p|
      pos_to_del << p if p.product_id == self.id && (self.hidden || !self.exist)
    end
    pos_to_del.each {|p|p.destroy}
  end

  def remove_positions_on_destroy
    pos = []
    Cart.where(confirmed: false).all.each do |cart|
      cart.positions.each do |p|
        pos << p
      end
    end
    pos_to_del = []
    pos.each do |p|
      pos_to_del << p if p.product_id == self.id
    end
    pos_to_del.each {|p|p.destroy}
  end
end
