class AddPageSettings < ActiveRecord::Migration
  def change
    add_column :settings, :orders_per_page, :integer, default: 3
    add_column :settings, :products_per_page, :integer, default: 10
  end
end
