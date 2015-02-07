class RemoveMainPageImage < ActiveRecord::Migration
  def change
    remove_column :settings, :main_page_img
  end
end
