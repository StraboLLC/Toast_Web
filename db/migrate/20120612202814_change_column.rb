class ChangeColumn < ActiveRecord::Migration
  def change
  	remove_column :albums, :taken_at
  	add_column :albums, :taken_at, :datetime
  end
end
