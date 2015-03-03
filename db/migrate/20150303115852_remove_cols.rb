class RemoveCols < ActiveRecord::Migration
  def change
    remove_column :products, :usd_price
  end
end
