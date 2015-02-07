class CreatePositions < ActiveRecord::Migration
  def change
    create_table :positions do |t|
      t.integer :cart_id
      t.integer :product_id
      t.integer :count, default: 1
      t.float :price, default: 0.0

      t.timestamps null: false
    end
  end
end
