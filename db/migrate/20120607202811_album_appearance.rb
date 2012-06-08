class AlbumAppearance < ActiveRecord::Migration
  def change

  	add_column :albums, :appearance, :string, :default => "red"

  end
end
