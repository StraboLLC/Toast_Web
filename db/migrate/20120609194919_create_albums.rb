class CreateAlbums < ActiveRecord::Migration
  def change
    create_table :albums do |t|
      t.string :name
      t.boolean :public
      t.string :cover
      t.datetime :uploaded_at
      t.string :token

      t.timestamps
    end
  end
end
