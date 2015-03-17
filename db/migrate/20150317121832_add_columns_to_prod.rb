class AddColumnsToProd < ActiveRecord::Migration
  def change
    add_column :products, :short_desc, :text
    add_column :products, :technical_desc, :text
    add_column :products, :manufacturer, :string
    add_column :products, :country, :string
    add_column :products, :weight, :string
  end
end
