class AddToPagesFields < ActiveRecord::Migration
  def change

    add_column :custom_pages, :type, :string
    add_column :custom_pages, :seq, :integer
    add_column :custom_pages, :url, :string
    add_column :custom_pages, :visible_for, :string, default: 'all'

  end
end
