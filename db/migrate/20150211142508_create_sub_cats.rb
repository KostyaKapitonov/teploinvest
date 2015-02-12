class CreateSubCats < ActiveRecord::Migration
  def change
    create_table :sub_cats do |t|
      t.integer :category_id
      t.string :name

      t.timestamps null: false
    end

    add_column :products, :sub_cat_id, :integer
  end
end
