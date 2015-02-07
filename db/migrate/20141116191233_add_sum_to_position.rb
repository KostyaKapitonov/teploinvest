class AddSumToPosition < ActiveRecord::Migration
  def change
    add_column :positions, :sum, :float, default: 0.0
  end
end
