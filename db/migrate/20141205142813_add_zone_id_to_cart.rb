class AddZoneIdToCart < ActiveRecord::Migration
  def change
    add_column :carts, :zone_id, :integer

    remove_column :positions, :usd_price
    remove_column :positions, :fixed_rub_price
    add_column :positions, :name, :string
  end
end
