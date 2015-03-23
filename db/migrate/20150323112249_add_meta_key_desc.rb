class AddMetaKeyDesc < ActiveRecord::Migration
  def change
    add_column :settings, :meta_keywords, :text
    add_column :settings, :meta_description, :text

    remove_column :products, :manufacturer

    add_column :products, :meta_keywords, :text
    add_column :products, :meta_description, :text
  end
end
