import { Rating, RatingInput } from "../libs/types/rating";
import ratingModel from "../schema/rating.model";

class RatingService {
  private readonly ratingModel;

  constructor() {
    this.ratingModel = ratingModel;
  }

  public async findMemberRating(
    memberId: any,
    bookId: any,
  ): Promise<Rating | null> {
    return await this.ratingModel.findOne({
      memberId,
      bookId,
    });
  }

  public async createRating(input: RatingInput): Promise<Rating> {
    return (await this.ratingModel.create(input)) as unknown as Rating;
  }

  public async updateRating(id: any, rating: number): Promise<Rating | null> {
    return await this.ratingModel.findByIdAndUpdate(
      id,
      { rating },
      { new: true },
    );
  }

  public async getRatingStats(bookId: any) {
    const [stats] = await this.ratingModel.aggregate([
      {
        $match: {
          bookId,
        },
      },
      {
        $group: {
          _id: "$bookId",
          averageRating: {
            $avg: "$rating",
          },
          ratingsCount: {
            $sum: 1,
          },
        },
      },
    ]);

    return {
      averageRating: stats?.averageRating ?? 0,
      ratingsCount: stats?.ratingsCount ?? 0,
    };
  }
}

export default RatingService;
