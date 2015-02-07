class AddExistFieldToProduct < ActiveRecord::Migration
  def change
    add_column :products, :exist ,:boolean, default: true
    add_column :products, :hidden ,:boolean, default: false
  end
end
