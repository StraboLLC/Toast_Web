class AddHeadingColumn < ActiveRecord::Migration
  def change
  	add_column :captures, :heading, :decimal
  end
end
