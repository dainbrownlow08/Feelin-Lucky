class CreateTokens < ActiveRecord::Migration[6.0]
  def change
    create_table :tokens do |t|
      t.references :player, null: false, foreign_key: true

      t.timestamps
    end
  end
end