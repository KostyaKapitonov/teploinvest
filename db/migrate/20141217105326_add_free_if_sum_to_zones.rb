class AddFreeIfSumToZones < ActiveRecord::Migration
  def change
    add_column :zones, :free_if_sum, :float
  end
end
