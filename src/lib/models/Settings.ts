import mongoose from 'mongoose'

export interface ISettings extends mongoose.Document {
    _id: string
    flashSaleEnabled: boolean
    flashSaleEndTime: Date
    flashSaleTitle: string
    flashSaleDescription: string
    createdAt: Date
    updatedAt: Date
}

const settingsSchema = new mongoose.Schema<ISettings>(
    {
        flashSaleEnabled: {
            type: Boolean,
            default: false,
        },
        flashSaleEndTime: {
            type: Date,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        },
        flashSaleTitle: {
            type: String,
            default: 'Flash Sale',
        },
        flashSaleDescription: {
            type: String,
            default: 'Limited Time Collection',
        },
    },
    {
        timestamps: true,
    }
)

const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema)

export default Settings
