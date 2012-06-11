class CreateCaptures < ActiveRecord::Migration
  def change
    create_table :captures do |t|
      t.string :title
      t.string :token
      t.decimal :latitude
      t.decimal :longitude
      t.text :description
      t.string :media_type

      t.timestamps
    end
  end
end
