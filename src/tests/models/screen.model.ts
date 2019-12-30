import { Repo, Field, ModelInMemory, Validator } from '@methodus/data';

/**
 * @hidden
 */
@ModelInMemory('Screen')
export class ScreenModel extends Repo<ScreenModel> {

    @Validator.IsNotEmpty()
    @Field()
    public Name?: string;

    @Field()
    public Type?: string;

    @Field()
    public Date?: Date;

    constructor(model: ScreenModel| any) {
        super(model, ScreenModel);
    }
}
