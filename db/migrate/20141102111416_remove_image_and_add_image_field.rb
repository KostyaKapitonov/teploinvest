class RemoveImageAndAddImageField < ActiveRecord::Migration
  def change
    drop_table :images
    add_column :products, :image, :string
  end
end
