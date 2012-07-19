class AddOrientation < ActiveRecord::Migration
  def change
  	add_column :captures, :orientation, :string, :default => "horizontal"

  end
end
