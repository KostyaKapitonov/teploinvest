class AddUsdPrice < ActiveRecord::Migration
  def change
    add_column :products, :usd_price, :float
    add_column :products, :fixed_rub_price, :boolean, default: false
    add_column :products, :available, :boolean, default: true

    add_column :positions, :usd_price, :float
    add_column :positions, :fixed_rub_price, :boolean, default: false

    add_column :settings, :recalculatable, :boolean, default: true

  end
end
