class AddAddressSelfDelivery < ActiveRecord::Migration
  def change
    add_column :carts, :self_delivery, :boolean, default: false
    add_column :carts, :address, :string
    add_column :settings, :self_delivery_address, :string
  end
end
