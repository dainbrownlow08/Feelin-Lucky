class PlayerSerializer
    def initialize(player_obj)
        @player = player_obj
    end

    def serialized_json
        options = {
            include: {
                tokens: {
                    only: [:id,:player_id]
                },
                games: {
                    only: [:id, :score, :player_id]
                }
            },
            except: [:created_at, :updated_at]
        }
        @player.to_json(options)
    end

end