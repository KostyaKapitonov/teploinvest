class RenameTableOptionToCategory < ActiveRecord::Migration
  def change
    rename_table :type_options, :categories
    rename_column :products, :type_option_id, :category_id
  end
end
